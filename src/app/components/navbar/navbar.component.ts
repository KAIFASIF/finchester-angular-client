import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  partnerName: string = '';
  fullname: string = '';
  avatarName: string = '';
  constructor(private sharedService: SharedService, private router: Router) {}
  ngOnInit() {
    // alert(JSON.stringify(this.sharedService))
    this.partnerName = this.sharedService?.partnerName;
    this.fullname = this.sharedService?.user?.fullname;
    this.avatarName = this.sharedService?.user?.fullname?.substring(0, 1)
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }
}
