import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() label: string ='';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() ngClass?: string ;
  @Output() onClick = new EventEmitter<any>();

  onClickButton(event:any){
    this.onClick.emit(event)
  }

}
