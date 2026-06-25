/**
 * Shared result shape for admin server actions consumed via useActionState.
 * `ok` flags success, `error` carries a user-safe message, and `message`
 * carries a success confirmation when the action does not redirect.
 */
export interface ActionState {
  ok: boolean;
  error?: string;
  message?: string;
}

export const INITIAL_ACTION_STATE: ActionState = { ok: false };
