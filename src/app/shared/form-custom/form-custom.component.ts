import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-custom',
  standalone: false,
  templateUrl: './form-custom.component.html',
  styleUrl: './form-custom.component.scss',
})
export class FormCustomComponent implements OnInit {
  @Input() fields: {
    name: string;
    type: string;
    label: string;
    placeholder?: string;
  }[] = [];
  @Output() formSubmit = new EventEmitter<any>();
  @Output() fieldRemove = new EventEmitter<string>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    const formControls: { [key: string]: FormControl } = {};

    this.fields.forEach((field) => {
      formControls[field.name] = new FormControl('', Validators.required);
    });

    this.form = this.fb.group(formControls);
  }

  removeField(fieldName: string) {
    this.fields = this.fields.filter((field) => field.name !== fieldName);
    this.form.removeControl(fieldName);
    this.fieldRemove.emit(fieldName);
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
  }
}
