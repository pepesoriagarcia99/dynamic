import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Artifact } from "../../../models/artifact/Artifact";

@Component({
  selector: 'auto-artifact',
  templateUrl: './auto-artifact.html'
})
export class AutoArtifact implements OnInit {

  @Input() data: Artifact;

    input: FormControl;

  ngOnInit(): void {

  }

}