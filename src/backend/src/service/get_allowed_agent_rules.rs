use crate::{auth_guard, utils::principal_to_blob, AgentRules, ALLOWED_AGENTS_RULES};

#[ic_cdk::query]
pub async fn get_allowed_agent_rules() -> Result<Option<AgentRules>, String> {
    auth_guard()?;

    let allowing_principal = principal_to_blob(ic_cdk::caller());

    let rules = ALLOWED_AGENTS_RULES.with_borrow(|rules| rules.get(&allowing_principal));

    Ok(rules)
}
