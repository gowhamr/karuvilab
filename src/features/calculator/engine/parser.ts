import Decimal from 'decimal.js';

export type AngleUnit = 'deg' | 'rad' | 'grad';

const OPERATORS = {
  '+': { precedence: 1, associativity: 'L' },
  '-': { precedence: 1, associativity: 'L' },
  '*': { precedence: 2, associativity: 'L' },
  '/': { precedence: 2, associativity: 'L' },
  '%': { precedence: 2, associativity: 'L' },
  '^': { precedence: 3, associativity: 'R' },
};

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
  'log', 'ln', 'sqrt', 'abs', 'floor', 'ceil', 'round'
]);

export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let numBuf = '';
  let strBuf = '';
  
  // Normalize the expression (e.g. replace special characters)
  expr = expr.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi');
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i] as string;
    
    if (/[0-9.]/.test(char)) {
      if (strBuf) {
        tokens.push(strBuf);
        strBuf = '';
      }
      numBuf += char;
    } else if (/[a-zA-Z]/.test(char)) {
      if (numBuf) {
        tokens.push(numBuf);
        tokens.push('*'); // Implicit multiplication (e.g. 2pi)
        numBuf = '';
      }
      strBuf += char;
    } else {
      if (numBuf) {
        tokens.push(numBuf);
        numBuf = '';
      }
      if (strBuf) {
        tokens.push(strBuf);
        strBuf = '';
      }
      
      // Implicit multiplication for parentheses: 2(3) -> 2 * (3)
      if (char === '(' && tokens.length > 0) {
        const last = tokens[tokens.length - 1] as string;
        if (/[0-9]/.test(last) || last === ')') {
          tokens.push('*');
        }
      }
      
      // Handle unary minus
      if (char === '-' && (tokens.length === 0 || tokens[tokens.length - 1] === '(' || (tokens[tokens.length - 1] as string) in OPERATORS)) {
        tokens.push('u-');
      } else {
        tokens.push(char);
      }
    }
  }
  
  if (numBuf) tokens.push(numBuf);
  if (strBuf) tokens.push(strBuf);
  
  return tokens;
}

export function toPostfix(tokens: string[]): string[] {
  const output: string[] = [];
  const operators: string[] = [];
  
  for (const token of tokens) {
    if (/[0-9]/.test(token) || token === 'pi' || token === 'e') {
      output.push(token);
    } else if (FUNCTIONS.has(token)) {
      operators.push(token);
    } else if (token === ',') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop()!);
      }
    } else if (token in OPERATORS || token === 'u-') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== '(' &&
        (
          FUNCTIONS.has(operators[operators.length - 1] as string) ||
          (token !== 'u-' && OPERATORS[token as keyof typeof OPERATORS] && OPERATORS[operators[operators.length - 1] as keyof typeof OPERATORS]?.precedence > OPERATORS[token as keyof typeof OPERATORS].precedence) ||
          (token !== 'u-' && OPERATORS[token as keyof typeof OPERATORS] && OPERATORS[operators[operators.length - 1] as keyof typeof OPERATORS]?.precedence === OPERATORS[token as keyof typeof OPERATORS].precedence && OPERATORS[token as keyof typeof OPERATORS].associativity === 'L')
        )
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop()!);
      }
      if (operators.length > 0 && operators[operators.length - 1] === '(') {
        operators.pop();
      }
      if (operators.length > 0 && FUNCTIONS.has(operators[operators.length - 1] as string)) {
        output.push(operators.pop()!);
      }
    }
  }
  
  while (operators.length > 0) {
    const op = operators.pop()!;
    if (op !== '(' && op !== ')') {
      output.push(op);
    }
  }
  
  return output;
}

function convertAngle(value: Decimal, unit: AngleUnit, toRadians: boolean): Decimal {
  const pi = Decimal.acos(-1);
  if (unit === 'rad') return value;
  
  if (toRadians) {
    return unit === 'deg' ? value.times(pi).div(180) : value.times(pi).div(200);
  } else {
    return unit === 'deg' ? value.times(180).div(pi) : value.times(200).div(pi);
  }
}

export function evaluatePostfix(postfix: string[], angleUnit: AngleUnit): string {
  if (postfix.length === 0) return '';
  const stack: Decimal[] = [];
  
  try {
    for (const token of postfix) {
      if (token === 'pi') {
        stack.push(Decimal.acos(-1));
      } else if (token === 'e') {
        stack.push(new Decimal(Math.E)); // Decimal.js doesn't have built in E
      } else if (/[0-9]/.test(token)) {
        stack.push(new Decimal(token));
      } else if (token === 'u-') {
        if (stack.length < 1) throw new Error("Invalid expression");
        stack.push(stack.pop()!.neg());
      } else if (token in OPERATORS) {
        if (stack.length < 2) throw new Error("Invalid expression");
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case '+': stack.push(a.plus(b)); break;
          case '-': stack.push(a.minus(b)); break;
          case '*': stack.push(a.times(b)); break;
          case '/': 
            if (b.isZero()) throw new Error("Division by zero");
            stack.push(a.div(b)); 
            break;
          case '%': stack.push(a.mod(b)); break;
          case '^': stack.push(a.pow(b)); break;
        }
      } else if (FUNCTIONS.has(token)) {
        if (stack.length < 1) throw new Error("Invalid expression");
        const a = stack.pop()!;
        switch (token) {
          case 'sin': stack.push(convertAngle(a, angleUnit, true).sin()); break;
          case 'cos': stack.push(convertAngle(a, angleUnit, true).cos()); break;
          case 'tan': stack.push(convertAngle(a, angleUnit, true).tan()); break;
          case 'asin': stack.push(convertAngle(a.asin(), angleUnit, false)); break;
          case 'acos': stack.push(convertAngle(a.acos(), angleUnit, false)); break;
          case 'atan': stack.push(convertAngle(a.atan(), angleUnit, false)); break;
          case 'sinh': stack.push(a.sinh()); break;
          case 'cosh': stack.push(a.cosh()); break;
          case 'tanh': stack.push(a.tanh()); break;
          case 'log': stack.push(a.log()); break; // Base 10
          case 'ln': stack.push(a.ln()); break;
          case 'sqrt': stack.push(a.sqrt()); break;
          case 'abs': stack.push(a.abs()); break;
          case 'floor': stack.push(a.floor()); break;
          case 'ceil': stack.push(a.ceil()); break;
          case 'round': stack.push(a.round()); break;
        }
      }
    }
    
    if (stack.length !== 1) throw new Error("Invalid expression");
    
    const result = stack[0] as Decimal;
    if (!result.isFinite()) throw new Error("Overflow");
    
    // Format appropriately
    if (result.abs().greaterThan(new Decimal('1e15')) || (result.abs().lessThan(new Decimal('1e-7')) && !result.isZero())) {
      return result.toExponential(7);
    }
    
    // Fix precision issues like 0.1 + 0.2
    return result.toDecimalPlaces(10).toString().replace(/\.?0+$/, '');
  } catch (err: any) {
    if (err.message === "Division by zero" || err.message === "Overflow") {
      return "Error";
    }
    return ""; // Incomplete expression, not an error just don't evaluate
  }
}

export function evaluateExpression(expr: string, angleUnit: AngleUnit = 'deg'): string {
  try {
    const tokens = tokenize(expr);
    const postfix = toPostfix(tokens);
    return evaluatePostfix(postfix, angleUnit);
  } catch (e) {
    return "";
  }
}
