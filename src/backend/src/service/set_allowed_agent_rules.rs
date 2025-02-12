use crate::{auth_guard, utils::principal_to_blob, AgentRules, ALLOWED_AGENTS_RULES};

#[ic_cdk::update]
pub async fn set_allowed_agent_rules(agent_rules: AgentRules) -> Result<AgentRules, String> {
    auth_guard()?;

    // The allowing principal is the caller of the function
    let allowing_principal = principal_to_blob(ic_cdk::caller());

    // The allowing principal sets the agent rules for an allowed agent
    ALLOWED_AGENTS_RULES.with_borrow_mut(|rules| {
        rules.insert(allowing_principal, agent_rules.clone());
    });

    Ok(agent_rules)
}
