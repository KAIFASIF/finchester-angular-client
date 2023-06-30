import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() count: number = 12;
  @Input() search: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() size: number = 5;
  @Input() page: number = 1;
  @Output() updateSize = new EventEmitter<number>();
  @Output() updatePage = new EventEmitter<number>();
  @Output() fetchUserLoans = new EventEmitter<{
    search: string;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
  }>();

  visiblePages: number[] = [];
  startIndex = 0;
  index = 1;

  ngOnInit(): void {
    this.updateVisiblePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['count']?.currentValue) {
      this.count = changes?.['count']?.currentValue;
      this.updateVisiblePages();
    }
    if( changes?.['count']?.currentValue ===0){
      this.visiblePages = []
    }
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.count / this.size))
      .fill(0)
      .map((_, index) => index + 1);
  }

  onSizeChange() {
    this.updatePage.emit(1);
    this.updateSize.emit(this.size);
    this.updateVisiblePages();
    this.index = 1;
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
      page: 1,
      size: this.size,
    };
    this.fetchUserLoans.emit(data);
  }

  onPageChange(newPage: number): void {
    this.index = newPage;
    this.updatePage.emit(newPage);
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
      page: newPage,
      size: this.size,
    };
    this.fetchUserLoans.emit(data);
  }

  // Update the visiblePages array based on the startIndex
  updateVisiblePages(): void {
    if (this.totalPages.length > 7) {
      this.visiblePages = this.totalPages.slice(
        this.startIndex,
        this.startIndex + 5
      );
    } else {
      this.visiblePages = this.totalPages;
    }
  }

  // Method to handle hiding the left index
  hideLeftNumbers(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.updateVisiblePages();
    }
    this.index--;
    this.updatePage.emit(this.index);
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.index,
      size: this.size,
    };
    this.fetchUserLoans.emit(data);
  }

  // Method to handle hiding the right index
  hideRightNumbers(): void {
    if (this.startIndex + 5 < this.totalPages.length) {
      this.startIndex++;
      this.updateVisiblePages();
    }
    this.index++;
    this.updatePage.emit(this.index);
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.index,
      size: this.size,
    };
    this.fetchUserLoans.emit(data);
  }


}
