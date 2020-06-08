import { context, logging, storage } from "near-sdk-as";
import { PostedMessage, messages } from "./model";

// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { TextMessage } from "./model";

const DEFAULT_MESSAGE = "Hello";
const MESSAGE_LIMIT = 10;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  //logging.log("Saving message");
  const message = new PostedMessage(text);

  // Adding the message to end of the the persistent collection
  messages.push(message);
}

/**
* Remove a validator from the system
**/
export function removeValidator(index: u32): PostedMessage {
  const validator = messages.swap_remove(index);

  return validator;
}

/**
 * Returns an array of last N messages.
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */ 
export function getMessages(): PostedMessage[] {

  //logging.log("getMessages called");
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);

  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }

  return result;
}

export function welcome(account_id: string): TextMessage {

  let message = new TextMessage();
  let greetingPrefix = storage.get<string>(account_id);

  if (!greetingPrefix) {
    greetingPrefix = DEFAULT_MESSAGE;
  }

  const s = printString(account_id);
  message.text = greetingPrefix + " " + s;

  return message;
}

export function setGreeting(message: string): void {
  storage.set(context.sender, message);
}

function printString(s: string): string {
  return s;
}

