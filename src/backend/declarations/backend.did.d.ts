import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Wei = bigint;
export interface _SERVICE {
  'allow_agent' : ActorMethod<[string], Result>,
  'get_address' : ActorMethod<[], Result>,
  'get_allowed_agent' : ActorMethod<[], Result>,
  'get_balance' : ActorMethod<[], Result>,
  'send_eth' : ActorMethod<[string, Wei], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
