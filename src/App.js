import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css"

//Global Object containing all actions---------------------------------------------------------------------------------------

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}


//Reducer actions-------------------------------------------------------------------------------------------------------------

function reducer(state, { type, payload }) {
  switch(type) {

    //ADD_DIGIT Action----------------------------------------------------------------------------
    case ACTIONS.ADD_DIGIT:
      
      //Checks for overwrite state from previous function
      //so next digit overwrites then resets overwrite state to false
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      
      
      //Prevents making a bunch of pointless zeroes
      if (payload.digit === "0" && state.currentOperand === "0") 
        return state
      
      if (payload.digit === "." && state.currentOperand == null)
        return state

      //Prevents multiple decimal points
      if (payload.digit === "." && state.currentOperand.includes(".")) 
        return state
      

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    //CLEAR Action-------------------------------------------------------------------------------
    case ACTIONS.CLEAR:
      return {}

    //CHOOSE_OPERATION Action--------------------------------------------------------------------
    case ACTIONS.CHOOSE_OPERATION:
     
    // Prevents operating on null---------------------------------------------
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      
      // Switches operation if current state ends with operation--------------
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      
      //Sets operation and moves current state to previous state--------------
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      //Evaluates and updates states when adding additional operations--------
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    
    //DELETE Action------------------------------------------------------------------------------
    case ACTIONS.DELETE_DIGIT:
      //Check for overwite state, clear operand and reset overwrite state if true
      if (state.overwite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      //If there is not a current operand, do nothing
      if (state.currentOperand == null) return state

      //If there is only one digit in the current operand, reset state of operand to null
      //(As opposed to an empty string)
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null}
      }

      //Default case: remove the last digit from current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    //EVALUATE Action----------------------------------------------------------------------------
    case ACTIONS.EVALUATE:
      
      //If state is incomplete, do nothing------------------------------------
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          currentOperand: evaluate(state)
        }

    default:
      console.log("Something has gone horribly wrong.");
  }
}


//Evaluate Function-----------------------------------------------------------------------------------------------------------

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  
  //If one of the current operators is not a number, do nothing
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
    default:
      console.log("Something has gone horribly wrong.");
    }
    return computation.toString()
  }

//Integer Formatter-----------------------------------------------------------------------------------------------------------
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


//Calculator grid-------------------------------------------------------------------------------------------------------------
function App() {
  const [{ currentOperand, previousOperand, operation}, dispatch] =  useReducer(reducer, {})

  return (
    <div className="calculator-body"><h1>Reactulator 1.0</h1>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button 
          className="span-two" 
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch}/>
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="*" dispatch={dispatch}/>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="+" dispatch={dispatch}/>
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <DigitButton digit="0" dispatch={dispatch}/>
        <button 
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>  
  )
}


export default App