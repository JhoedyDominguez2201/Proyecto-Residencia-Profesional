import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableRightClick]'
})
export class DisableRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event): void {
    event.preventDefault();
  }
}
