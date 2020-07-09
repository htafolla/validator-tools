
import BN from 'bn.js';
import { deserialize, base_encode} from '../node_modules/near-api-js/src/utils/serialize'

import {PublicKey} from '../node_modules/near-api-js/src/utils/key_pair';
import {Assignable} from '../node_modules/near-api-js/src/utils/enums';

var Big = require('big.js');

const sha256 = require('js-sha256').sha256;

export class IAction extends Assignable {}

class RewardFeeFraction extends Assignable {
    'numerator': number;
    'denominator': number;
}

export class Account extends Assignable {
    'unstaked': BN;
    'stake_shares': BN;
    'unstaked_available_epoch_height': number;
}

export class AccountsMap extends Assignable {
    'deprecated': number;
    'key_index_prefix':  Uint8Array;
    'keys': AccountsMapKeys;
    'values': AccountsMapValues;
}

export class AccountsMapKeys extends Assignable { 
    'len': number;
    'prefix': Uint8Array;
}

export class AccountsMapValues extends Assignable {
    'len': number;
    'prefix': Uint8Array;
}

export class StakingContract extends Assignable {
    'owner_id': string;
    'stake_public_key': PublicKey;
    'last_epoch_height': number;
    'total_stake_shares': BN;
    'total_staked_balance': BN;
    'reward_fee_fraction': RewardFeeFraction;
    'accounts': AccountsMap;
}

export class AccountHash extends Assignable {
    'hash': Uint8Array;
}

export const SCHEMA = new Map<Function, any>([
  [
        StakingContract,
        {
            kind: 'struct',
            fields: [
                ['owner_id', 'string'],
                ['stake_public_key', PublicKey],
                ['last_epoch_height', 'u64'],
                ['last_total_balance', 'u128'],
                ['total_stake_shares', 'u128'],
                ['total_staked_balance', 'u128'],
                ['reward_fee_fraction', RewardFeeFraction],
                ['accounts', AccountsMap],
            ],
        },
    ],
    [
        RewardFeeFraction,
        {
            kind: 'struct',
            fields: [
                ['numerator', 'u32'],
                ['denominator', 'u32'],
            ],
        },
    ],
    [
        AccountsMap,
        {
            kind: 'struct',
            fields: [
                ['key_index_prefix', ['u8']],
                ['keys', AccountsMapKeys],
                ['values', AccountsMapValues],
            ],
        },
    ],
    [
        AccountsMapKeys,
        {
            kind: 'struct',
            fields: [
                ['len', 'u64'],
                ['prefix', ['u8']],
            ],
        },
    ],
    [
        AccountsMapValues,
        {
            kind: 'struct',
            fields: [
                ['len', 'u64'],
                ['prefix', ['u8']],
            ],
        },
    ],
    [
        Account,
        {
            kind: 'struct',
            fields: [
                ['unstaked', 'u128'],
                ['stake_shares', 'u128'],
                ['unstaked_available_epoch_height', 'u64'],
            ],
        },
    ],
    [
        PublicKey,
        {
            kind: 'struct',
            fields: [
                ['key', ['u8']]
            ],
        },
    ],
    [
     AccountHash,
        {
            kind: 'struct',
            fields: [['hash', ['u8']]],
        },
    ],
]);

export const ACCOUNT = new Map<Function, any>([
    [
        Account,
        {
            kind: 'struct',
            fields: [
                ['unstaked', 'u128'],
                ['stake_shares', 'u128'],
                ['unstaked_available_epoch_height', 'u64'],
            ],
        },
    ],
]);

export const ACCOUNTHASH = new Map<Function, any>([
    [
     AccountHash,
        {
            kind: 'struct',
            fields: [['hash', ['u8']]],
        },
    ],
]);


export function deserializeData(data) {

 //ar Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  //t decodedData = Base64.decode(data);
  var dataBuffer = Buffer.from(data.values[0].value, 'base64')
  //r dataBuffer1= Buffer.from(decodedData)

  let decerialized = deserialize(SCHEMA, StakingContract , dataBuffer);

   let map = {}

   let values = data.values;

   // values are returned from the RPC state
   for (let i = 1; i < values.length; i++) {

        let key = values[i].key

        let keyBuffer = Buffer.from(key, 'base64')
        let prefix = keyBuffer.slice(0, 2).toString('utf-8')

        let index

        switch (prefix) {
            case 'ui':
                break

            case 'uk':    
                let accountHash = decodeAccountHash(AccountHash, values[i].value)
                //console.log(sha256(Buffer.from(accountHash.hash).toString('hex').toString());
                let accountHashHex = Buffer.from(accountHash.hash).toString('hex')

                let idxDataHash =  keyBuffer.slice(2);
                index = readBigUInt64LE(idxDataHash);

                map[index] = {
                    accountHashHex,
                }

                break

            case 'uv':
                let account = decodeAccount(Account, values[i].value)
                account.stake_shares = account.stake_shares.toString()
                account.unstaked = account.unstaked.toString()
                account.unstaked_available_epoch_height = account.unstaked_available_epoch_height.toString()

                let idxDataAccount =  keyBuffer.slice(2);
                index = readBigUInt64LE(idxDataAccount);

                map[index].value = account

                break
        }
    }

    console.log(map)

  decerialized.stake_public_key.key.shift();
  console.log(base_encode(decerialized.stake_public_key.key));

  console.log(decerialized.last_epoch_height.toString())
  console.log(decerialized.last_total_balance.toString())
  console.log(decerialized.total_stake_shares.toString())
  console.log(decerialized.total_staked_balance.toString())

  return decerialized

}

export function decodeAccountHash(class_type, data) {

    return deserialize(ACCOUNTHASH, class_type ,  Buffer.from(data, 'base64'));

}

export function decodeAccount(class_type, data) {

    return deserialize(ACCOUNT, class_type ,  Buffer.from(data, 'base64'));

}


export function readBigUInt64LE(buffer, offset = 0) {
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined) {
    throw new Error('Out of bounds');
  }

  const lo = first +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    buffer[++offset] * 2 ** 24;

  const hi = buffer[++offset] +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    last * 2 ** 24;

  return BigInt(lo) + (BigInt(hi) << 32n);
}


