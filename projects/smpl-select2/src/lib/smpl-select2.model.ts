import { Observable } from 'rxjs';

export interface Select2Config {
  allowClear?: boolean;
  placeholder?: string;

  disabled?: boolean;
  multiple?: boolean;
  selectOnClose?: boolean;

  width?: string;
  theme?: string;

  maximumInputLength?: number;
  maximumSelectionLength?: number;
  minimumInputLength?: number;
  minimumResultsForSearch?: number;

  data?: any[];

  ajax?: any;

  templateResult?: (item: any) => string;
  templateSelection?: (item: any) => string;
}

export interface Select2DataSource {
  data?: any[];

  ajaxFn?: Observable<any[]>;
  ajaxDelay?: number;

  dataTransformFn?: (data: any[]) => Select2Option[];
}

export interface Select2Option {
  id: any;
  text: any;
  selected?: boolean;
  disabled?: boolean;
  children?: Select2Option[];
}
