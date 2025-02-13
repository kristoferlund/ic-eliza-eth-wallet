use crate::{auth_guard, utils::principal_to_blob, AgentRules, AGENT_RULES};

#[ic_cdk::update]
pub async fn set_agent_rules(agent_rules: AgentRules) -> Result<AgentRules, String> {
    auth_guard()?;

    let wallet = principal_to_blob(ic_cdk::caller());

    // Link agent rules to wallet
    AGENT_RULES.with_borrow_mut(|rules| {
        rules.insert(wallet, agent_rules.clone());
    });

    Ok(agent_rules)
}
