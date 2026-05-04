import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  departments = ['Financeiro', 'RH', 'Operações', 'Comercial', 'TI'];
  scoringOptions = {
    c1: [1, 2, 3], c2: [1, 2, 3], c3: [1, 2, 3], c4: [1, 2, 3], c5: [1, 2, 3], c6: [1, 2, 3], c7: [1, 2, 3]
  };

  form = this.fb.nonNullable.group({
    useCaseName: ['', Validators.required],
    department: ['', Validators.required],
    owner: ['', Validators.required],
    description: ['', Validators.required],
    c1: [1], c2: [1], c3: [1], c4: [1], c5: [1], c6: [1], c7: [1],
    costCenter: ['', Validators.required],
    environment: ['Sandbox', Validators.required],
    sensitivity: ['Média', Validators.required],
    businessValue: [0, Validators.required]
  });

  total = computed(() => Object.entries(this.form.value)
    .filter(([k]) => /^c\d$/.test(k))
    .reduce((acc, [, v]) => acc + Number(v ?? 0), 0));

  platform = computed(() => this.total() >= 14 || Number(this.form.value.c7) === 3 ? 'AI Factory' : 'Copilot Studio');
  alertRequired = computed(() => Number(this.form.value.c7) === 3);
  status = signal('Draft');

  saveDraft() { this.submit('draft'); }
  submitAic() { this.submit('submitted'); }

  private submit(status: 'draft' | 'submitted') {
    this.http.post('http://localhost:3000/api/usecases', { ...this.form.getRawValue(), status }).subscribe(() => {
      this.status.set(status === 'draft' ? 'Draft' : 'Submetido');
    });
  }
}
