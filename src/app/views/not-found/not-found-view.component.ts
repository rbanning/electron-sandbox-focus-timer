import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTriangleExclamation as errorIcon } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, FontAwesomeModule],
  templateUrl: './not-found-view.component.html',
  styles: ':host { display: block; }'
})
export class NotFoundViewComponent {

  icon = errorIcon;

}
