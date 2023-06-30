import { Subject } from "rxjs";

export class ToasterService {
  isVisible: boolean = false;
  isVisibleChanged: Subject<boolean> = new Subject<boolean>();

  showToaster() {
    this.isVisible = true;
    this.isVisibleChanged.next(true);

    setTimeout(() => {
      this.isVisible = false;
      this.isVisibleChanged.next(false);
    }, 2000); // Hide the toaster after 5 seconds (5000 milliseconds)
  }
}
