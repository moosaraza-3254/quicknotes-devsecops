# Security Policy & DevSecOps Gate Standards

## Automated Security Gates
Every Pull Request and push to `main` is enforced by automated security checks before code can merge or deploy to AWS:

1. **Secret Scanning (Gitleaks):** Scans the full Git commit history. Any detected credential or API token fails the pipeline immediately.
2. **Static Application Security Testing (SonarCloud):** Enforces the SonarCloud Quality Gate across `api` and `web` source code and test coverage.
3. **Software Composition Analysis (Snyk + Dependabot):** Scans root, `api`, and `web` dependency trees (`package-lock.json`) and fails on any **High** or **Critical** severity vulnerability. Dependabot opens automated weekly dependency update PRs.
4. **Container Image Scanning (Trivy):** Scans built multi-stage Docker images (`quicknotes-api` and `quicknotes-web`) and fails on any **HIGH** or **CRITICAL** OS or library vulnerability.
5. **Infrastructure & Runtime Hardening:**
   - Containers run as non-root (`UID 1000`) on pinned minimal Alpine base images.
   - GitHub Actions authenticates to AWS via short-lived **OIDC** tokens (zero static AWS access keys).
   - EC2 instances reside in private subnets with SSH closed (`port 22` blocked), accessible only through the Application Load Balancer or AWS SSM Session Manager.

## Vulnerability Triage & Exceptions
- All **High** and **Critical** findings must be remediated before merging to `main`.
- If a finding is a verified false positive or has no upstream patch available, it must be documented below with its CVE ID, affected package, justification, and mitigation controls rather than disabling scanners or lowering thresholds.

| CVE / Rule ID | Component | Severity | Justification & Mitigation |
| :--- | :--- | :--- | :--- |
| *None active* | — | — | All current dependencies and base images pass with zero High/Critical findings. |
