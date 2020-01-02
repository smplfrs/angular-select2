import { Observable } from 'rxjs';

export interface Select2Config {
  allowClear?: boolean;
  placeholder?: string | ISelect2Option;

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

  ajaxFn?: Observable<any>;
  ajaxDelay?: number;
  transformFn?: (data: any[]) => ISelect2Option[];
}

export interface ISelect2Option {
  id: any;
  text: any;
  selected?: boolean;
  disabled?: boolean;
  children?: ISelect2Option[];
}
