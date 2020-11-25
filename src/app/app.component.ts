import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {NbIconLibraries} from '@nebular/theme';
import {AuthService} from './services/auth.service';
import {untilDestroyed} from '@ngneat/until-destroy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public authLayout: boolean;
  public currentUser: any;

  title = 'Nebular';

  constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef, private iconLibraries: NbIconLibraries){

    this.iconLibraries.registerFontPack('fa', { packClass:'fa', iconClassPrefix: 'fa' });
  }

  ngAfterViewInit(): void {

    //this.cdRef.detectChanges()

  }
  ngAfterContentInit(): void {

    //this.cdRef.detectChanges()
  }

  ngOnInit(): void {

    this.authService.currentUser.pipe(untilDestroyed(this)).subscribe(data =>
    {

      this.currentUser = data

      if (!data) {
        this.authLayout = true

        this.router.navigate(['login'])
      }
    })

  }

  ngAfterContentChecked(){



    this.cdRef.detectChanges()

  }
}

