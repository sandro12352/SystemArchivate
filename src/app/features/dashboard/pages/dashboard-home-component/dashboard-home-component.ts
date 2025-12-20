import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { User } from '../../../users/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth-service';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

interface Campaign {
  id: number;
  name: string;
  platform: string;
  progress: number;
  status: string;
  statusColor: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: number;
  platform: string;
}

interface Video {
  id: number;
  title: string;
  duration: string;
  platform: string;
}

interface Document {
  id: number;
  title: string;
  size: string;
}


@Component({
  selector: 'app-dashboard-home-component',
  imports: [CardModule,ButtonModule,CommonModule,
    ProgressBarModule,
    TimelineModule,
    CarouselModule,
    TagModule],
  templateUrl: './dashboard-home-component.html',
  styleUrl: './dashboard-home-component.css',
})






export class DashboardHomeComponent {

  private authService = inject(AuthService);
  public user:User | null = this.authService.getUserSession();


  carouselIndex: number = 0;

  campaigns: Campaign[] = [
    {
      id: 1,
      name: "Campaña Facebook Ads - Verano",
      platform: "Facebook",
      progress: 65,
      status: "Activa",
      statusColor: "success"
    },
    {
      id: 2,
      name: "SEO Optimización Web",
      platform: "Google",
      progress: 40,
      status: "En revisión",
      statusColor: "warning"
    },
    {
      id: 3,
      name: "Email Marketing Q4",
      platform: "Email",
      progress: 100,
      status: "Completada",
      statusColor: "info"
    },
    {
      id: 4,
      name: "Estrategia Instagram Stories",
      platform: "Instagram",
      progress: 55,
      status: "En curso",
      statusColor: "secondary"
    }
  ];

  meetings: Meeting[] = [
    {
      id: 1,
      title: "Reunión de Estrategia Digital",
      date: "24 Oct",
      time: "14:00",
      attendees: 5,
      platform: "Google Meet"
    },
    {
      id: 2,
      title: "Review de Campañas Q4",
      date: "25 Oct",
      time: "10:00",
      attendees: 8,
      platform: "Zoom"
    },
    {
      id: 3,
      title: "Brainstorm Contenidos",
      date: "26 Oct",
      time: "16:30",
      attendees: 3,
      platform: "Teams"
    }
  ];

  videos: Video[] = [
    {
      id: 1,
      title: "Guía de Google Analytics 4",
      duration: "12:45",
      platform: "YouTube"
    },
    {
      id: 2,
      title: "Tendencias Marketing Digital",
      duration: "18:20",
      platform: "Vimeo"
    }
  ];

  documents: Document[] = [
    {
      id: 1,
      title: "Plan de Marketing 2024",
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "Análisis Competencia",
      size: "1.8 MB"
    }
  ];

  nextSlide(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.campaigns.length;
  }

  prevSlide(): void {
    this.carouselIndex = (this.carouselIndex - 1 + this.campaigns.length) % this.campaigns.length;
  }

}
