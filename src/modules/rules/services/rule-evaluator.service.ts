import { Injectable } from '@nestjs/common';

import { RuleCondition, RuleNode } from '../types/rule.types';

@Injectable()
export class RuleEvaluatorService {
  evaluate(definition: RuleNode, context: Record<string, unknown>): boolean {
    if (definition.all) {
      return definition.all.every((node) => this.evaluate(node, context));
    }

    if (definition.any) {
      return definition.any.some((node) => this.evaluate(node, context));
    }

    if (!definition.condition) {
      return true;
    }

    return this.evaluateCondition(definition.condition, context);
  }

  private evaluateCondition(
    condition: RuleCondition,
    context: Record<string, unknown>,
  ): boolean {
    const left = this.resolveField(condition.field, context);
    const right = condition.value;

    switch (condition.operator) {
      case 'eq':
        return left === right;
      case 'neq':
        return left !== right;
      case 'gt':
        return Number(left) > Number(right);
      case 'gte':
        return Number(left) >= Number(right);
      case 'lt':
        return Number(left) < Number(right);
      case 'lte':
        return Number(left) <= Number(right);
      case 'contains':
        return Array.isArray(left)
          ? left.includes(right)
          : String(left).includes(String(right));
      case 'in':
        return Array.isArray(right) ? right.includes(left) : false;
      default:
        return false;
    }
  }

  private resolveField(path: string, context: Record<string, unknown>): unknown {
    return path
      .split('.')
      .reduce<unknown>((value, key) =>
        typeof value === 'object' && value !== null
          ? (value as Record<string, unknown>)[key]
          : undefined,
      context);
  }
}
