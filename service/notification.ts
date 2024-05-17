import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { Alert, Platform } from 'react-native';
import { TaskType } from '@/interfaces/task';

export async function checkNotificationAllowed() {
  const settings = await Notifications.getPermissionsAsync();
  const allowed = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  console.log(`Notif Granted? ${allowed}`)
  if (!allowed && settings.canAskAgain) {
    const result = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    console.log(`Ask Again Result? ${result.granted}`)
    if (result.granted) return true
    else return false
  }
  return allowed;
}

export async function scheduleNotifications(task: TaskType) {
  const time = new Date(task.datetime);
  console.log(` SCHEDULE A NOTIFICATION AT ${time.toISOString()} CURRENT TIME ${new Date().toISOString()}
  `)
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: task.title,
      body: task.details ?? "You got a reminder from qwikplan :)",
    },
    trigger: time,
    identifier: task.id,
  });
  console.log(`TASK ID ${task.id}`)
  console.log(`NOTIFICATION ID ${identifier}`)
}

export async function deleteNotifications(id: string) {
  console.log(`NOTIF ${id} deletion requested`)
  await Notifications.cancelScheduledNotificationAsync(id)
}

export async function rescheduleNotification(task: TaskType) {
  console.log('RESCHEDULING')
  await Notifications.cancelScheduledNotificationAsync(task.id)
  await scheduleNotifications(task)
}