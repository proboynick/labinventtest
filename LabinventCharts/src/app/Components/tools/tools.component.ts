import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { setIsRemoveZeroValues } from '../../Redux/files-store.actions';

@Component({
  selector: 'app-tools',
  imports: [CheckboxModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent {
  constructor(private store: Store) {}

  toggleZeroValues(event: CheckboxChangeEvent) {
    const isChecked = event.checked;
    this.store.dispatch(setIsRemoveZeroValues({ value: isChecked }));
  }
}
