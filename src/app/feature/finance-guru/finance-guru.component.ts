import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrAlertModule, ClrInputModule } from '@clr/angular';
import { GoogleGenAI } from "@google/genai";
import { environment } from 'environments/environment';
import { MarkdownModule } from 'ngx-markdown'; 

@Component({
  selector: 'app-finance-guru',
  templateUrl: './finance-guru.component.html',
  styleUrls: ['./finance-guru.component.scss'],
  standalone: true,
  imports: [ClrInputModule, ClrAlertModule, ReactiveFormsModule, CommonModule, MarkdownModule],
})
export class FinanceGuruComponent {
  ai = new GoogleGenAI({ apiKey: `${environment.GOOGLE_API_KEY}` });
  aiSuggestion: string = '';
  loading: boolean = false;
  askForm: FormGroup = new FormGroup({
    income: new FormControl(''),
    expense: new FormControl(''),
    goal: new FormControl(''),
  });

  async fetchResponse(prompt: string) {
    console.log("Fetching response from AI with prompt:", prompt);
    this.loading = true;
    await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    }).then((response: any) => {
      this.aiSuggestion = response.text;
      this.loading = false;
      console.log("AI response received:", this.aiSuggestion);
    });
  }

  submit() {
    console.log("Form submitted");
    console.log(this.askForm.value);
    const prompt = `You are a finance expert and you have to advice on savings and investments. Advice should be based on Indian economy and existing investment plans. Financial Situation: Income: ${this.askForm.value.income}, Expense: ${this.askForm.value.expense}, Goal: ${this.askForm.value.goal}`;
    this.fetchResponse(prompt);
  }
  reset() {
    this.askForm.reset();
    this.aiSuggestion = '';
  }
}
