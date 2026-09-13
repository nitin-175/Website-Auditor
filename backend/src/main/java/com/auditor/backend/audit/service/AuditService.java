package com.auditor.backend.audit.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auditor.backend.audit.dto.AuditResponse;
import com.auditor.backend.audit.dto.AuditStatusResponse;
import com.auditor.backend.audit.dto.AuditSummary;
import com.auditor.backend.audit.dto.CreateAuditRequest;
import com.auditor.backend.audit.entity.Audit;
import com.auditor.backend.audit.entity.AuditIssue;
import com.auditor.backend.audit.entity.AuditJob;
import com.auditor.backend.audit.entity.AuditScore;
import com.auditor.backend.audit.entity.CoreWebVital;
import com.auditor.backend.audit.repository.AuditIssueRepository;
import com.auditor.backend.audit.repository.AuditRepository;
import com.auditor.backend.audit.repository.AuditScoreRepository;
import com.auditor.backend.audit.repository.CoreWebVitalRepository;
import com.auditor.backend.exception.ResourceNotFoundException;
import com.auditor.backend.user.entity.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AuditService {

    private final AuditRepository auditRepository;
    private final AuditScoreRepository auditScoreRepository;
    private final AuditIssueRepository auditIssueRepository;
    private final CoreWebVitalRepository coreWebVitalRepository;
    private final AuditJobService auditJobService;
    private final AuditEngineClient auditEngineClient;
    private final ObjectMapper objectMapper;

    public AuditService(
            AuditRepository auditRepository,
            AuditScoreRepository auditScoreRepository,
            AuditIssueRepository auditIssueRepository,
            CoreWebVitalRepository coreWebVitalRepository,
            AuditJobService auditJobService,
            AuditEngineClient auditEngineClient,
            ObjectMapper objectMapper) {

        this.auditRepository = auditRepository;
        this.auditScoreRepository = auditScoreRepository;
        this.auditIssueRepository = auditIssueRepository;
        this.coreWebVitalRepository = coreWebVitalRepository;
        this.auditJobService = auditJobService;
        this.auditEngineClient = auditEngineClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AuditResponse createAudit(
            CreateAuditRequest request,
            User user) {

        LocalDateTime now = LocalDateTime.now();

        Audit audit = new Audit();

        audit.setUser(user);
        audit.setUrl(request.getUrl());
        audit.setDevice(request.getDevice());
        audit.setStatus("PENDING");
        audit.setOverallScore(null);
        audit.setStartedAt(null);
        audit.setCompletedAt(null);
        audit.setCreatedAt(now);
        audit.setUpdatedAt(now);

        Audit savedAudit
                = auditRepository.save(audit);

        auditJobService.createJob(savedAudit);

        return toAuditResponse(savedAudit);
    }

    /*
     * Executes the audit through the Node.js
     * Lighthouse engine and saves the result.
     */
    @Transactional
    public AuditResponse executeAudit(
            Long auditId,
            User user) {

        Audit audit = auditRepository
                .findByIdAndUser(auditId, user)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Audit not found"));

        AuditJob job
                = auditJobService.getJob(audit);

        try {

            /*
             * Mark audit and job as running.
             */
            markAuditRunning(audit);

            auditJobService.startJob(job);

            /*
             * Send URL + device to Node.js.
             */
            String engineResponse
                    = auditEngineClient.runAudit(
                            audit.getUrl(),
                            audit.getDevice()
                    );

            /*
             * Parse Node.js JSON response.
             */
            JsonNode response
                    = objectMapper.readTree(engineResponse);

            if (!response.path("success").asBoolean(false)) {

                String message
                        = response.path("message")
                                .asText(
                                        "Audit engine failed");

                throw new RuntimeException(message);
            }

            JsonNode result
                    = response.path("result");

            if (result.isMissingNode()) {
                throw new RuntimeException(
                        "Audit engine returned no result");
            }

            /*
             * Save scores.
             */
            saveScoresFromResult(
                    audit,
                    result
            );

            /*
             * Save Core Web Vitals.
             */
            saveVitalsFromResult(
                    audit,
                    result
            );

            /*
             * Save issues.
             */
            saveIssuesFromResult(
                    audit,
                    result
            );

            /*
             * Calculate and save overall score.
             */
            BigDecimal overallScore
                    = decimalValue(
                            result
                                    .path("scores")
                                    .path("overall")
                    );

            completeAudit(
                    audit,
                    overallScore
            );

            auditJobService.completeJob(job);

            return toAuditResponse(audit);

        } catch (Exception exception) {

            auditJobService.failJob(
                    job,
                    exception.getMessage()
            );

            failAudit(
                    audit,
                    exception.getMessage()
            );

            throw new RuntimeException("Audit execution failed");
        }
    }

    private void saveScoresFromResult(
            Audit audit,
            JsonNode result) {

        JsonNode scores
                = result.path("scores");

        saveAuditScore(
                audit,
                decimalValue(
                        scores.path("performance")
                ),
                decimalValue(
                        scores.path("accessibility")
                ),
                decimalValue(
                        scores.path("bestPractices")
                ),
                decimalValue(
                        scores.path("seo")
                )
        );
    }

    private void saveVitalsFromResult(
            Audit audit,
            JsonNode result) {

        JsonNode vitals
                = result.path("vitals");

        saveCoreWebVitals(
                audit,
                decimalValue(
                        vitals.path("lcpMs")
                ),
                decimalValue(
                        vitals.path("inpMs")
                ),
                decimalValue(
                        vitals.path("cls")
                ),
                decimalValue(
                        vitals.path("fcpMs")
                )
        );
    }

    private void saveIssuesFromResult(
            Audit audit,
            JsonNode result) {

        JsonNode issues
                = result.path("issues");

        if (!issues.isArray()) {
            return;
        }

        for (JsonNode issue : issues) {

            saveAuditIssue(
                    audit,
                    textValue(
                            issue.path("category")
                    ),
                    textValue(
                            issue.path("severity")
                    ),
                    textValue(
                            issue.path("title")
                    ),
                    textValue(
                            issue.path("description")
                    ),
                    textValue(
                            issue.path("recommendation")
                    )
            );
        }
    }

    private BigDecimal decimalValue(
            JsonNode node) {

        if (node == null
                || node.isMissingNode()
                || node.isNull()
                || !node.isNumber()) {

            return null;
        }

        return node.decimalValue();
    }

    private String textValue(
            JsonNode node) {

        if (node == null
                || node.isMissingNode()
                || node.isNull()) {

            return null;
        }

        return node.asText();
    }

    @Transactional(readOnly = true)
    public List<AuditSummary> getUserAudits(
            User user) {

        List<Audit> audits
                = auditRepository.findByUserOrderByCreatedAtDesc(user);

        if (audits.isEmpty()) {
            return List.of();
        }

        List<Long> auditIds = audits.stream()
                .map(Audit::getId)
                .toList();

        java.util.Map<Long, Long> issueCounts
                = auditIssueRepository.countByAuditIds(auditIds)
                        .stream()
                        .collect(
                                java.util.stream.Collectors.toMap(
                                        row -> (Long) row[0],
                                        row -> (Long) row[1]
                                )
                        );

        return audits.stream()
                .map(audit -> new AuditSummary(
                audit.getId(),
                audit.getUrl(),
                audit.getDevice(),
                audit.getStatus(),
                audit.getOverallScore(),
                audit.getCreatedAt(),
                issueCounts.getOrDefault(audit.getId(), 0L)
                        .intValue()
        ))
                .toList();
    }

    @Transactional(readOnly = true)
    public AuditResponse getUserAudit(
            Long id,
            User user) {

        Audit audit = auditRepository
                .findByIdAndUser(id, user)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Audit not found"));

        return toAuditResponse(audit);
    }

    @Transactional(readOnly = true)
    public AuditStatusResponse getAuditStatus(
            Long id,
            User user) {

        Audit audit = auditRepository
                .findByIdAndUser(id, user)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Audit not found"));

        return new AuditStatusResponse(
                audit.getId(),
                audit.getStatus(),
                audit.getStartedAt(),
                audit.getCompletedAt()
        );
    }

    @Transactional
    public void markAuditRunning(
            Audit audit) {

        LocalDateTime now
                = LocalDateTime.now();

        audit.setStatus("RUNNING");
        audit.setStartedAt(now);
        audit.setUpdatedAt(now);

        auditRepository.save(audit);
    }

    @Transactional
    public void saveAuditScore(
            Audit audit,
            BigDecimal performance,
            BigDecimal accessibility,
            BigDecimal bestPractices,
            BigDecimal seo) {

        AuditScore score
                = auditScoreRepository
                        .findByAudit(audit)
                        .orElseGet(
                                AuditScore::new
                        );

        score.setAudit(audit);
        score.setPerformance(performance);
        score.setAccessibility(accessibility);
        score.setBestPractices(bestPractices);
        score.setSeo(seo);
        score.setCreatedAt(
                LocalDateTime.now()
        );

        auditScoreRepository.save(score);
    }

    @Transactional
    public void saveCoreWebVitals(
            Audit audit,
            BigDecimal lcpMs,
            BigDecimal inpMs,
            BigDecimal cls,
            BigDecimal fcpMs) {

        CoreWebVital vital
                = coreWebVitalRepository
                        .findByAudit(audit)
                        .orElseGet(
                                CoreWebVital::new
                        );

        vital.setAudit(audit);
        vital.setLcpMs(lcpMs);
        vital.setInpMs(inpMs);
        vital.setCls(cls);
        vital.setFcpMs(fcpMs);
        vital.setCreatedAt(
                LocalDateTime.now()
        );

        coreWebVitalRepository.save(vital);
    }

    @Transactional
    public void saveAuditIssue(
            Audit audit,
            String category,
            String severity,
            String title,
            String description,
            String recommendation) {

        AuditIssue issue
                = new AuditIssue();

        issue.setAudit(audit);
        issue.setCategory(category);
        issue.setSeverity(severity);
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setRecommendation(
                recommendation
        );
        issue.setCreatedAt(
                LocalDateTime.now()
        );

        auditIssueRepository.save(issue);
    }

    @Transactional
    public void completeAudit(
            Audit audit,
            BigDecimal overallScore) {

        LocalDateTime now
                = LocalDateTime.now();

        audit.setStatus("COMPLETED");
        audit.setOverallScore(
                overallScore
        );
        audit.setCompletedAt(now);
        audit.setUpdatedAt(now);

        auditRepository.save(audit);
    }

    @Transactional
    public void failAudit(
            Audit audit,
            String errorMessage) {

        LocalDateTime now
                = LocalDateTime.now();

        audit.setStatus("FAILED");
        audit.setCompletedAt(now);
        audit.setUpdatedAt(now);

        auditRepository.save(audit);
    }

    private AuditResponse toAuditResponse(Audit audit) {

        AuditScore score = auditScoreRepository
                .findByAudit(audit)
                .orElse(null);

        CoreWebVital vital = coreWebVitalRepository
                .findByAudit(audit)
                .orElse(null);

        List<AuditIssue> auditIssues
                = auditIssueRepository.findByAudit(audit);

        AuditResponse.ScoreResponse scores = null;

        if (score != null) {
            scores = new AuditResponse.ScoreResponse(
                    score.getPerformance(),
                    score.getAccessibility(),
                    score.getBestPractices(),
                    score.getSeo()
            );
        }

        AuditResponse.VitalsResponse vitals = null;

        if (vital != null) {
            vitals = new AuditResponse.VitalsResponse(
                    vital.getLcpMs(),
                    vital.getInpMs(),
                    vital.getCls(),
                    vital.getFcpMs()
            );
        }

        List<AuditResponse.IssueResponse> issues
                = auditIssues.stream()
                        .map(issue -> new AuditResponse.IssueResponse(
                        issue.getId(),
                        issue.getCategory(),
                        issue.getSeverity(),
                        issue.getTitle(),
                        issue.getDescription(),
                        issue.getRecommendation()
                ))
                        .toList();

        List<AuditResponse.RecommendationResponse> recommendations
                = auditIssues.stream()
                        .filter(issue
                                -> issue.getRecommendation() != null
                        && !issue.getRecommendation().isBlank()
                        )
                        .map(issue -> new AuditResponse.RecommendationResponse(
                        issue.getId(),
                        issue.getTitle(),
                        issue.getRecommendation(),
                        formatPriority(issue.getSeverity())
                ))
                        .toList();

        return new AuditResponse(
                audit.getId(),
                audit.getUrl(),
                audit.getDevice(),
                audit.getStatus(),
                audit.getOverallScore(),
                audit.getStartedAt(),
                audit.getCompletedAt(),
                audit.getCreatedAt(),
                audit.getUpdatedAt(),
                scores,
                vitals,
                issues,
                recommendations
        );
    }

    private String formatPriority(String severity) {

        if (severity == null) {
            return "Low";
        }

        return switch (severity.toLowerCase()) {
            case "critical", "high" ->
                "High";
            case "medium" ->
                "Medium";
            default ->
                "Low";
        };
    }

}
