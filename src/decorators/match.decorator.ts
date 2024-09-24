import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'MatchPassword',
  async: false,
})
export class MatchPassword implements ValidatorConstraintInterface {
  validate(
    password: any,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    // ? Comparar password con la password de confirmación
    if (password !== (args.object as any)[args.constraints[0]]) return false;

    return true;
  }
  defaultMessage(args?: ValidationArguments): string {
    return 'La Clave y la clave de confirmación deben coincidir';
  }
}
