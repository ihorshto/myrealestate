<script>
import { ref } from 'vue'
import { Calendar } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { identity } from '@fullcalendar/core/internal'


let id = ref(10)



export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listDay' // user can switch between the two
                },

                dateClick: this.handleDateClick,
                events: [
                    { title: 'event 1', date: '2023-07-08', currentHour: '22:13:11' },
                    { title: 'event 2', date: '2023-07-07', currentHour: '22:13:11' },
                ],
                eventClick: this.handleDeleteClick,
                // hide list of todo
                dayMaxEventRows: true, // for all non-TimeGrid views
                views: {
                    timeGrid: {
                        dayMaxEventRows: 4 // adjust to 6 only for timeGridWeek/timeGridDay
                    }
                },
                editable: true,
                // select one task for few days
                selectable: true,
                select: (arg) => {
                    identity.value = id.value + 1
                    const cal = arg.view.calendar
                    let date = new Date();
                    let currentDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

                    cal.unselect()
                    cal.addEvent({

                        id: `${id.value++}`,
                        title: prompt("Enter name of event:"),
                        start: arg.start,
                        end: arg.end,
                        date: arg.dateStr,
                        currentHour: currentDate,
                        allDay: true
                    })
                    console.log("cal fd", cal.start);
                },
            }
        }
    },
    methods: {
        handleDateClick: function (arg) {
            let message = prompt("Your title")
            let date = new Date();
            let currentDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            if (message.length > 0) {
                let obj = { title: message, date: arg.dateStr, currentHour: currentDate };
                this.calendarOptions.events.push(obj);
            } else {
                let obj = { title: 'Chicha', date: arg.dateStr, currentHour: currentDate }
                console.log('else')
                this.calendarOptions.events.push(obj);
            }
        },
        handleDeleteClick: function (arg) {
            console.log(arg.event.id);
            console.log('arg.start', arg.event.start);
            console.log('arg.start', arg.event.end);
            // arg.event.remove()

            // title window
            const modelTitle = document.getElementById('exampleModalLabel')
            // // dates
            const dateDebut = document.getElementById('date-debut')
            const dateEnd = document.getElementById('date-end')

            modelTitle.innerHTML = arg.event.title;

            let myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
            document.onreadystatechange = function () {
                myModal.show();
            };
            myModal.show();

            dateDebut.innerHTML = arg.event.start;
            console.log("dateDebut.innerHTML", dateDebut.innerHTML);
            dateEnd.innerHTML = arg.event.end;
        },
    }

}

</script>
<template>
    <div class="container">

        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body">
                            <h4>Date debut:</h4>
                            <p id="date-debut"></p>
                            <h4>Date end:</h4>
                            <p id="date-end"></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <FullCalendar :options="calendarOptions" :header="{
            left: 'title',
            center: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek',
            right: 'prev today next'

        }">
            <template v-slot:eventContent='arg'>
                <b id="temp">{{ arg.event.title }}</b><br>
                <b>{{ arg.event.extendedProps.currentHour }}</b><br>
                <b>{{ arg.event.extendedProps.start }}</b><br>
            </template>

        </FullCalendar>



    </div>
</template>