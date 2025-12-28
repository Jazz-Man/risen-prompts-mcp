# Code Review: {pr_title}

**PR #**: {pr_number}
**Author**: {author}
**Reviewer**: {reviewer}
**Date**: {date}
**Files Changed**: {files_changed}
**Lines**: +{lines_added} / -{lines_removed}

## Summary
{pr_description}

## Review Checklist

### 🏗️ Architecture & Design
- [ ] Follows established patterns: {patterns_check}
- [ ] SOLID principles: {solid_check}
- [ ] Appropriate abstractions: {abstractions_check}
- [ ] No over-engineering: {overengineering_check}

### 🔧 Code Quality
- [ ] Readable and self-documenting: {readability_check}
- [ ] DRY (Don't Repeat Yourself): {dry_check}
- [ ] Appropriate naming: {naming_check}
- [ ] Complexity manageable: {complexity_check}

### 🧪 Testing
- [ ] Unit tests added/updated: {unit_tests_check}
- [ ] Integration tests: {integration_tests_check}
- [ ] Edge cases covered: {edge_cases_check}
- [ ] Test coverage adequate: {coverage_check}

### 🔒 Security
- [ ] Input validation: {input_validation_check}
- [ ] No hardcoded secrets: {secrets_check}
- [ ] SQL injection prevention: {sql_injection_check}
- [ ] XSS prevention: {xss_check}
- [ ] Authentication/Authorization: {auth_check}

### ⚡ Performance
- [ ] No N+1 queries: {n_plus_one_check}
- [ ] Efficient algorithms: {algorithm_check}
- [ ] Caching considered: {caching_check}
- [ ] Database indexes: {indexes_check}

### 📝 Documentation
- [ ] Code comments where needed: {comments_check}
- [ ] README updated: {readme_check}
- [ ] API documentation: {api_docs_check}
- [ ] Changelog entry: {changelog_check}

## Detailed Feedback

### 🌟 What's Great
{positive_feedback}

### 🔍 Issues Found

#### Critical (Must Fix)
1. **{critical_issue_1}**
   - Location: `{critical_location_1}`
   - Issue: {critical_description_1}
   - Suggestion: {critical_suggestion_1}

#### Major (Should Fix)
1. **{major_issue_1}**
   - Location: `{major_location_1}`
   - Issue: {major_description_1}
   - Suggestion: {major_suggestion_1}

#### Minor (Consider Fixing)
1. **{minor_issue_1}**
   - Location: `{minor_location_1}`
   - Issue: {minor_description_1}
   - Suggestion: {minor_suggestion_1}

### 💡 Suggestions for Improvement
{improvement_suggestions}

## Code Examples

### Current Implementation
```{language}
{current_code}
```

### Suggested Improvement
```{language}
{improved_code}
```

**Rationale**: {improvement_rationale}

## Overall Assessment

**Approval Status**: {approval_status}
**Confidence Level**: {confidence_level}/10
**Estimated Impact**: {impact_assessment}

## Action Items
- [ ] {action_item_1}
- [ ] {action_item_2}
- [ ] {action_item_3}

## Additional Notes
{additional_notes}
