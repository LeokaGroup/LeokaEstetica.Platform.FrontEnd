import { Component } from '@angular/core';

@Component({
  selector: 'app-assistant-ai',
  templateUrl: './assistant-ai.component.html',
  styleUrls: ['./assistant-ai.component.scss']
})

export class AssistantAIComponent {
  public isOpen = false;

  public toggleChat() {
    this.isOpen = !this.isOpen;
  }

  public messages = [
    { text: "Добрый день! Как я могу вам помочь?", sender: "bot" },
    { text: "Добрый день!", sender: "user" }
  ];

  public newMessage = "";

  public sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: "user" });
      this.newMessage = "";
    }
  }

  public onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }
}
