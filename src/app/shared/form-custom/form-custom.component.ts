import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-form-custom',
  standalone: false,
  templateUrl: './form-custom.component.html',
  styleUrls: ['./form-custom.component.scss'],
})
export class FormCustomComponent implements OnInit, OnChanges, AfterContentInit {
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
  submitted = false;

  /**
   * Détecte la présence de l'élément projeté portant l'attribut `form-footer`.
   * Usage côté parent :
   * <app-form-custom ...>
   *   <div form-footer>...</div>
   * </app-form-custom>
   */
  @ContentChild('[form-footer]', { read: ElementRef })
  private projectedFooterEl?: ElementRef;

  hasProjectedFooter = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterContentInit(): void {
    this.hasProjectedFooter = !!this.projectedFooterEl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }

    if (changes['user'] && this.form) {
      this.patchFormWithUser();
    }
  }

  private buildForm(): void {
    const formControls: { [key: string]: FormControl } = {};

    this.fields.forEach((field) => {
      formControls[field.name] = new FormControl('', Validators.required);
    });

    this.form = this.fb.group(formControls);
    this.submitted = false;

    this.patchFormWithUser();
  }

  removeField(fieldName: string): void {
    this.fields = this.fields.filter((field) => field.name !== fieldName);
    this.form.removeControl(fieldName);
    this.fieldRemove.emit(fieldName);
  }

  private patchFormWithUser(): void {
    if (!this.user || !this.form) return;

    const patch: any = {};
    this.fields.forEach((field) => {
      const value = (this.user as any)[field.name];
      if (value !== undefined) patch[field.name] = value;
    });

    this.form.patchValue(patch);
  }

  isInvalid(fieldName: string): boolean {
    const ctrl = this.form.get(fieldName);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.value);
  }
}