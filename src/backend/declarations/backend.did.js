export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Wei = IDL.Nat;
  return IDL.Service({
    'allow_agent' : IDL.Func([IDL.Text], [Result], []),
    'get_address' : IDL.Func([], [Result], []),
    'get_allowed_agent' : IDL.Func([], [Result], ['query']),
    'get_balance' : IDL.Func([], [Result], []),
    'send_eth' : IDL.Func([IDL.Text, Wei], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
