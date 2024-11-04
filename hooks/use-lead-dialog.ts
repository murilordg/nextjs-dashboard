"use client"

import * as React from "react"

export type DialogSelectCommand = {
  inserted?: { id: string, name: string }
}

type LeadDialogProps = {
  title?: string
  show: boolean;
}

const actionTypes = {
  SHOW_DIALOG: "SHOW_DIALOG",
  CLOSE_DIALOG: "CLOSE_DIALOG",
} as const

type ActionType = typeof actionTypes

type Action =
  | {
    type: ActionType["SHOW_DIALOG"]
    dialog: LeadDialogProps
    updateOptions?: (command?: DialogSelectCommand) => void
  }
  | {
    type: ActionType["CLOSE_DIALOG"]
    dialog: LeadDialogProps
    command?: DialogSelectCommand
  }

interface State {
  dialog: LeadDialogProps,
  updateOptions?: (command?: DialogSelectCommand) => void
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { dialog: { show: false } }

function dispatch(action: Action) {
  if (action.type === actionTypes.SHOW_DIALOG) {
    memoryState = { dialog: action.dialog, updateOptions: action.updateOptions }

    listeners.forEach((listener) => {
      listener(memoryState);
    });

  } else if (action.type === actionTypes.CLOSE_DIALOG) {
    if (memoryState.updateOptions) memoryState.updateOptions(action.command)
    memoryState = { dialog: { show: false }, }

    listeners.forEach((listener) => {
      listener(memoryState);
    });

  }
}

function showLeadDialog(title: string, updateOptions?: (command?: DialogSelectCommand) => void) {
  dispatch({
    type: actionTypes.SHOW_DIALOG,
    dialog: { title, show: true },
    updateOptions,
  })

  return {
    id: 1,
  }
}

function useLeadDialog() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    showLeadDialog,
    dismiss: (cmd?: DialogSelectCommand) => { dispatch({ type: actionTypes.CLOSE_DIALOG, dialog: { show: false }, command: cmd }) },
  }
}

export { useLeadDialog, showLeadDialog }
