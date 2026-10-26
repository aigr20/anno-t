import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
  name: "bcAd",
})
export class BcAdPipe implements PipeTransform {
  transform(value: number): string {
    return `${Math.abs(value)} ${toSuffix(value)}`;
  }
}

export function toSuffix(v: number): string {
  if (v === 0) {
    return "";
  }
  if (v > 0) {
    return "AD";
  }
  return "BC";
}
