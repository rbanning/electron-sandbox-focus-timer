import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from '@components/brand/brand.component';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-primary-header',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, BrandComponent],
  templateUrl: './primary-header.component.html',
  styles: ':host { display: block; }'
})
export class PrimaryHeaderComponent {}
