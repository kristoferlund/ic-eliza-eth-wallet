import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AgentRules {
  'transactions_per_day' : number,
  'max_transaction_amount' : Wei,
}
export type GetAllowedAgentResult = { 'Ok' : [] | [string] } |
  { 'Err' : string };
export type GetAllowedAgentRulesResult = { 'Ok' : [] | [AgentRules] } |
  { 'Err' : string };
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type SetAllowedAgentRulesResult = { 'Ok' : AgentRules } |
  { 'Err' : string };
export type Wei = bigint;
export interface _SERVICE {
  'get_address' : ActorMethod<[], Result>,
  'get_allowed_agent' : ActorMethod<[], GetAllowedAgentResult>,
  'get_allowed_agent_rules' : ActorMethod<[], GetAllowedAgentRulesResult>,
  'get_balance' : ActorMethod<[], Result>,
  'send_eth' : ActorMethod<[string, Wei], Result>,
  'set_allowed_agent' : ActorMethod<[string], Result>,
  'set_allowed_agent_rules' : ActorMethod<
    [AgentRules],
    SetAllowedAgentRulesResult
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
