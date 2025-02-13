use crate::{auth_guard, utils::principal_to_blob, AgentRules, AGENT_RULES};

#[ic_cdk::query]
pub async fn get_agent_rules() -> Result<Option<AgentRules>, String> {
    auth_guard()?;

    let wallet = principal_to_blob(ic_cdk::caller());

    Ok(AGENT_RULES.with_borrow(|ar| ar.get(&wallet)))
}
