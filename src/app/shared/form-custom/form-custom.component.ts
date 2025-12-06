import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from '../../core/models/user';
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

  @Input() user: User | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() fieldRemove = new EventEmitter<string>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le user change et que le form est déjà construit → on met à jour les valeurs
    if (changes['user'] && this.form) {
      this.patchFormWithUser();
    }

    // Si les fields changent après coup, on peut éventuellement rebuild le form
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }
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

  private patchFormWithUser(): void {
    if (!this.user || !this.form) return;

    const patch: any = {};

    this.fields.forEach((field) => {
      const value = (this.user as any)[field.name];
      if (value !== undefined) {
        patch[field.name] = value;
      }
    });

    this.form.patchValue(patch);
  }


  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
  }
}
