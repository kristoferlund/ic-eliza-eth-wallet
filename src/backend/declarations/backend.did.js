export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const GetAllowedAgentResult = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Text),
    'Err' : IDL.Text,
  });
  const Wei = IDL.Nat;
  const AgentRules = IDL.Record({
    'transactions_per_day' : IDL.Nat32,
    'max_transaction_amount' : Wei,
  });
  const GetAllowedAgentRulesResult = IDL.Variant({
    'Ok' : IDL.Opt(AgentRules),
    'Err' : IDL.Text,
  });
  const SetAllowedAgentRulesResult = IDL.Variant({
    'Ok' : AgentRules,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'get_address' : IDL.Func([], [Result], []),
    'get_allowed_agent' : IDL.Func([], [GetAllowedAgentResult], ['query']),
    'get_allowed_agent_rules' : IDL.Func(
        [],
        [GetAllowedAgentRulesResult],
        ['query'],
      ),
    'get_balance' : IDL.Func([], [Result], []),
    'send_eth' : IDL.Func([IDL.Text, Wei], [Result], []),
    'set_allowed_agent' : IDL.Func([IDL.Text], [Result], []),
    'set_allowed_agent_rules' : IDL.Func(
        [AgentRules],
        [SetAllowedAgentRulesResult],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
