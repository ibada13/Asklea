import { diagnosis_history } from "../defintions";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
  } from 'chart.js';
  
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend
  );  
import { Line } from "react-chartjs-2";
  
export default function Chart({ diagnosis_history , range }: {diagnosis_history:diagnosis_history[],range:number}) { 

    const recentHistory  = diagnosis_history.slice(-range)
      const labels = recentHistory.map(item=>`${item.month.slice(0,3) },${item.year}`).reverse()
      const systolicData = recentHistory.map(item => item.blood_pressure.systolic.value).reverse();
      const diastolicData =recentHistory.map(item => item.blood_pressure.diastolic.value).reverse();
      const data = {
          labels: labels,
          datasets: [
            
                  {
                    data: systolicData,
                    borderColor: '#C26EB4',
                    backgroundColor: '#E66FD2',
                    
                  tension: 0,
                  pointRadius: 5,
                  pointHoverRadius: 8,
                  interaction: {
                      intersect: false,
                    } ,
                  },
                  {
                    data: diastolicData,
                    borderColor: '#7E6CAB',
                    backgroundColor: '#8C6FE6',
                    
                  tension: 0,
                  pointRadius: 5,
                  pointHoverRadius: 8,
                  interaction: {
                      intersect: false,
                    } ,
                  },
          ],
        };
      const options: ChartOptions<'line'> = {
          responsive: true,
        scales: {
          x: {
            grid: {
              display:false,
            },
            ticks: {
              maxTicksLimit: range, 
            },
          },
          y: {
            min: 60, 
            max:180, 
            ticks: {
              stepSize:20,
            }
          
          }
        },
          plugins: {
            legend: {
              display:false,
              position: 'top',
            },
          },
        };
      
    return (
        <Line className="self-center"  data = { data } options = { options } />
    )
     
}