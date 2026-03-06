import { Component, Input, OnInit } from "@angular/core";
import { Artifact } from "../../../models/artifact/Artifact";

@Component({
  selector: 'spacer-artifact',
  templateUrl: './spacer-artifact.html'
})
export class SpacerArtifact implements OnInit {

  @Input() data: Artifact;

  ngOnInit(): void {

  }

}