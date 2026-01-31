import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { BrandComponent } from '@components/brand/brand.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref, BrandComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
