import { Component, Input } from '@angular/core';
import { ToasterService } from 'src/app/services/toasterService/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
})
export class ToasterComponent {
  @Input() message?: string;
  @Input() severity?: 'success' | 'error';
  isVisible: boolean = false;

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.toasterService.isVisibleChanged.subscribe((value) => {
      this.isVisible = value;
    });
  }
}
