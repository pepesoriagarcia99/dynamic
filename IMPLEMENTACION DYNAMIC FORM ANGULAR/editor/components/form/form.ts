import { Component, Input, OnInit } from '@angular/core';
import { FormBackend } from '../../models/input/InputBuilder';
import { Form } from '../../models/form/Form';
import { GeneralFormStrategy } from '../../models/form/FormStrategy';

export const form: FormBackend = {
  id: '1',
  schemas: [
    {
      id: '1',
      name: 'Tab 1',
      columns: 12, // número de columnas del grid
      visible: 'leader_name_column == 12', // sustituido por el interprete de expresiones
      artifacts: [
        {
          id: '1',
          type: 'AUTO',
          editable: true, // extraido de la config del column
          span: 2, // tamaño del artefacto
          visible: 'leader_name_column == 12',
          properties: {
            column: 'leader_last_name_column', // columna asociada al control

            label: '',
            placeholder: '',
            helper: '' // texto de ayuda mostrado en el tooltip

            // maxCharts: 10,
            // maxDecimals: 4,
          }
        },
        {
          id: '2',
          type: 'SPACER',
          span: 10
        }
      ]
    }
  ]
};

@Component({
  selector: 'form',
  templateUrl: './form.html'
})
export class FormImpl implements OnInit {
  @Input() data: FormBackend;

  ngOnInit(): void {
    const email = Form.FormBuilder
      .setForm(this.data || form)
      .setEditable(true)
      .setStrategy(new GeneralFormStrategy())
      .build();
  }
}
