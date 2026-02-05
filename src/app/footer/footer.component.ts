import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });

      constructor(private fb: FormBuilder) {}

      submit() {
        if (this.form.invalid) return;
        console.log(this.form.value.email);
        alert('Merci pour votre abonnement');
      }

     openSection: number | null = null;

      toggle(index: number) {
        this.openSection = this.openSection === index ? null : index;
      }

}
