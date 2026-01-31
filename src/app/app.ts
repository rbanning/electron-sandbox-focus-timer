import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimaryFooterComponent } from '@components/nav/primary-footer/primary-footer.component';
import { PrimaryHeaderComponent } from '@components/nav/primary-header/primary-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimaryHeaderComponent, PrimaryFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
