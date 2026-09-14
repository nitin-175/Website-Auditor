CREATE TABLE audits (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    url VARCHAR(2048) NOT NULL,
    device VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    overall_score DECIMAL(5,2) NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_audits PRIMARY KEY (id),

    CONSTRAINT fk_audits_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_audits_device
        CHECK (device IN ('DESKTOP', 'MOBILE')),

    CONSTRAINT chk_audits_status
        CHECK (
            status IN (
                'PENDING',
                'RUNNING',
                'COMPLETED',
                'FAILED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_audits_overall_score
        CHECK (
            overall_score IS NULL
            OR (overall_score >= 0 AND overall_score <= 100)
        )
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE INDEX idx_audits_user_id
    ON audits (user_id);

CREATE INDEX idx_audits_status
    ON audits (status);

CREATE INDEX idx_audits_created_at
    ON audits (created_at);

CREATE INDEX idx_audits_user_created_at
    ON audits (user_id, created_at);


CREATE TABLE audit_scores (
    id BIGINT NOT NULL AUTO_INCREMENT,
    audit_id BIGINT NOT NULL,
    performance DECIMAL(5,2) NOT NULL,
    accessibility DECIMAL(5,2) NOT NULL,
    best_practices DECIMAL(5,2) NOT NULL,
    seo DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_audit_scores PRIMARY KEY (id),

    CONSTRAINT uk_audit_scores_audit_id UNIQUE (audit_id),

    CONSTRAINT fk_audit_scores_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_audit_scores_performance
        CHECK (performance >= 0 AND performance <= 100),

    CONSTRAINT chk_audit_scores_accessibility
        CHECK (accessibility >= 0 AND accessibility <= 100),

    CONSTRAINT chk_audit_scores_best_practices
        CHECK (best_practices >= 0 AND best_practices <= 100),

    CONSTRAINT chk_audit_scores_seo
        CHECK (seo >= 0 AND seo <= 100)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE TABLE core_web_vitals (
    id BIGINT NOT NULL AUTO_INCREMENT,
    audit_id BIGINT NOT NULL,
    lcp_ms DECIMAL(10,2) NULL,
    inp_ms DECIMAL(10,2) NULL,
    cls DECIMAL(10,4) NULL,
    fcp_ms DECIMAL(10,2) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_core_web_vitals PRIMARY KEY (id),

    CONSTRAINT uk_core_web_vitals_audit_id UNIQUE (audit_id),

    CONSTRAINT fk_core_web_vitals_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_core_web_vitals_lcp
        CHECK (lcp_ms IS NULL OR lcp_ms >= 0),

    CONSTRAINT chk_core_web_vitals_inp
        CHECK (inp_ms IS NULL OR inp_ms >= 0),

    CONSTRAINT chk_core_web_vitals_cls
        CHECK (cls IS NULL OR cls >= 0),

    CONSTRAINT chk_core_web_vitals_fcp
        CHECK (fcp_ms IS NULL OR fcp_ms >= 0)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE TABLE audit_issues (
    id BIGINT NOT NULL AUTO_INCREMENT,
    audit_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_audit_issues PRIMARY KEY (id),

    CONSTRAINT fk_audit_issues_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_audit_issues_severity
        CHECK (
            severity IN (
                'CRITICAL',
                'HIGH',
                'MEDIUM',
                'LOW',
                'INFO'
            )
        )
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE INDEX idx_audit_issues_audit_id
    ON audit_issues (audit_id);

CREATE INDEX idx_audit_issues_severity
    ON audit_issues (severity);


CREATE TABLE audit_jobs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    audit_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_message TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_audit_jobs PRIMARY KEY (id),

    CONSTRAINT uk_audit_jobs_audit_id UNIQUE (audit_id),

    CONSTRAINT fk_audit_jobs_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_audit_jobs_attempts
        CHECK (attempts >= 0),

    CONSTRAINT chk_audit_jobs_status
        CHECK (
            status IN (
                'PENDING',
                'RUNNING',
                'COMPLETED',
                'FAILED',
                'CANCELLED'
            )
        )
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE INDEX idx_audit_jobs_status
    ON audit_jobs (status);


CREATE TABLE audit_schedules (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    url VARCHAR(2048) NOT NULL,
    device VARCHAR(20) NOT NULL DEFAULT 'DESKTOP',
    frequency VARCHAR(20) NOT NULL,
    next_run_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_audit_schedules PRIMARY KEY (id),

    CONSTRAINT fk_audit_schedules_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_audit_schedules_device
        CHECK (device IN ('DESKTOP', 'MOBILE')),

    CONSTRAINT chk_audit_schedules_frequency
        CHECK (
            frequency IN (
                'DAILY',
                'WEEKLY',
                'MONTHLY'
            )
        )
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE INDEX idx_audit_schedules_user_id
    ON audit_schedules (user_id);

CREATE INDEX idx_audit_schedules_next_run
    ON audit_schedules (next_run_at);

CREATE INDEX idx_audit_schedules_active_next_run
    ON audit_schedules (is_active, next_run_at);