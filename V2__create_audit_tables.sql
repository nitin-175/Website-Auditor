

CREATE TABLE audits (
    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    url VARCHAR(2048) NOT NULL,

    device VARCHAR(20) NOT NULL DEFAULT 'desktop',

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    overall_score DECIMAL(5,2) NULL,

    started_at TIMESTAMP NULL,

    completed_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_audits_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_audits_user_id
ON audits(user_id);


CREATE INDEX idx_audits_user_created_at
ON audits(user_id, created_at DESC);


CREATE INDEX idx_audits_status
ON audits(status);


CREATE TABLE audit_scores (
    id BIGINT NOT NULL AUTO_INCREMENT,

    audit_id BIGINT NOT NULL,

    performance DECIMAL(5,2) NOT NULL,

    accessibility DECIMAL(5,2) NOT NULL,

    best_practices DECIMAL(5,2) NOT NULL,

    seo DECIMAL(5,2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT uk_audit_scores_audit
        UNIQUE (audit_id),

    CONSTRAINT fk_audit_scores_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON DELETE CASCADE
);


CREATE TABLE core_web_vitals (
    id BIGINT NOT NULL AUTO_INCREMENT,

    audit_id BIGINT NOT NULL,

    lcp_ms DECIMAL(10,2) NULL,

    inp_ms DECIMAL(10,2) NULL,

    cls DECIMAL(10,4) NULL,

    fcp_ms DECIMAL(10,2) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT uk_core_web_vitals_audit
        UNIQUE (audit_id),

    CONSTRAINT fk_core_web_vitals_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON DELETE CASCADE
);


CREATE TABLE audit_issues (
    id BIGINT NOT NULL AUTO_INCREMENT,

    audit_id BIGINT NOT NULL,

    category VARCHAR(50) NOT NULL,

    severity VARCHAR(20) NOT NULL,

    title VARCHAR(500) NOT NULL,

    description TEXT NULL,

    recommendation TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_audit_issues_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_audit_issues_audit_id
ON audit_issues(audit_id);


CREATE INDEX idx_audit_issues_category
ON audit_issues(category);


CREATE INDEX idx_audit_issues_severity
ON audit_issues(severity);


CREATE TABLE audit_jobs (
    id BIGINT NOT NULL AUTO_INCREMENT,

    audit_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'queued',

    attempts INT NOT NULL DEFAULT 0,

    started_at TIMESTAMP NULL,

    completed_at TIMESTAMP NULL,

    error_message TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT uk_audit_jobs_audit
        UNIQUE (audit_id),

    CONSTRAINT fk_audit_jobs_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_audit_jobs_status
ON audit_jobs(status);


CREATE INDEX idx_audit_jobs_status_created
ON audit_jobs(status, created_at);