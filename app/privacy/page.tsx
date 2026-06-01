import type { Metadata } from "next";
import Link from "next/link";

import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных сайта oriokerg.ru: какие данные собираются, цели, сервисы аналитики и права пользователей.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2 июня 2026 г.";
const DOMAIN = "oriokerg.ru";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-8 text-muted text-pretty">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const contacts = getSettings<ContactsSettings>("contacts");
  const operator = contacts.operator?.trim() || `Владелец сайта ${DOMAIN}`;
  const email = contacts.email?.trim();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs uppercase tracking-luxe text-accent-strong">
        Юридическая информация
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
        Политика конфиденциальности
      </h1>
      <p className="mt-4 text-sm text-muted">Обновлено: {LAST_UPDATED}</p>

      <div className="mt-10">
        <Section title="1. Общие положения">
          <p>
            Настоящая Политика конфиденциальности (далее — «Политика») определяет
            порядок обработки и защиты персональных данных пользователей сайта{" "}
            <strong>{DOMAIN}</strong> (далее — «Сайт»). Оператором обработки
            данных является {operator} (далее — «Оператор»).
          </p>
          <p>
            Используя Сайт, вы подтверждаете согласие с условиями настоящей
            Политики и даёте согласие на обработку ваших данных описанными ниже
            способами. Если вы не согласны с Политикой, пожалуйста, не используйте
            Сайт.
          </p>
          <p>
            Обработка персональных данных осуществляется в соответствии с
            Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
        </Section>

        <Section title="2. Какие данные мы собираем">
          <p>Оператор может обрабатывать следующие данные:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Технические данные, собираемые автоматически:</strong> IP-адрес,
              тип и версия браузера, операционная система, источник перехода,
              просмотренные страницы, действия на странице (клики, движения курсора,
              прокрутка), дата и время посещения, файлы cookie.
            </li>
            <li>
              <strong>Данные, которые вы сообщаете добровольно</strong> при обращении к
              нам через мессенджеры, телефон или электронную почту: имя, контактные
              данные и содержание вашего сообщения.
            </li>
          </ul>
          <p>
            Сайт не запрашивает и не хранит платёжные данные. Специальные категории
            персональных данных не обрабатываются.
          </p>
        </Section>

        <Section title="3. Цели обработки">
          <ul className="ml-5 list-disc space-y-2">
            <li>обеспечение работы Сайта и его корректного отображения;</li>
            <li>
              анализ посещаемости и поведения пользователей для улучшения Сайта;
            </li>
            <li>обработка обращений и ответы на запросы пользователей;</li>
            <li>информирование о доступных котятах и услугах питомника.</li>
          </ul>
        </Section>

        <Section title="4. Сервисы аналитики и cookie">
          <p>
            Сайт использует сервис веб-аналитики <strong>Яндекс.Метрика</strong>,
            предоставляемый ООО «ЯНДЕКС». Сервис использует файлы cookie и собирает
            обезличенные данные о посещениях, включая запись действий пользователя на
            странице (Вебвизор), для анализа и улучшения работы Сайта. Собранные данные
            обрабатываются на условиях{" "}
            <a
              href="https://yandex.ru/legal/confidential/"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              политики конфиденциальности Яндекса
            </a>
            . Вы можете отказаться от сбора данных Метрикой, настроив{" "}
            <a
              href="https://yandex.ru/support/metrica/general/opt-out.html"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              блокировку
            </a>
            .
          </p>
          <p>
            <strong>Файлы cookie</strong> — небольшие текстовые файлы, сохраняемые
            браузером. Вы можете отключить cookie в настройках браузера, однако это
            может повлиять на работу отдельных функций Сайта.
          </p>
        </Section>

        <Section title="5. Передача данных третьим лицам">
          <p>
            Оператор не продаёт и не передаёт персональные данные третьим лицам, за
            исключением случаев, предусмотренных законодательством РФ, а также передачи
            обезличенных данных поставщикам инфраструктуры (сервис аналитики
            Яндекс.Метрика, хостинг-провайдер) исключительно для целей, указанных в
            настоящей Политике.
          </p>
        </Section>

        <Section title="6. Сроки и защита">
          <p>
            Данные обрабатываются не дольше, чем этого требуют цели обработки или
            законодательство РФ. Оператор принимает разумные организационные и
            технические меры для защиты данных от неправомерного доступа, изменения,
            раскрытия или уничтожения.
          </p>
        </Section>

        <Section title="7. Ваши права">
          <p>В отношении своих персональных данных вы вправе:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>получать информацию об их обработке;</li>
            <li>требовать уточнения, блокирования или удаления данных;</li>
            <li>отозвать ранее данное согласие на обработку.</li>
          </ul>
          <p>
            Для реализации прав направьте запрос{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                на {email}
              </a>
            ) : (
              <>
                через{" "}
                <Link
                  href="/contacts"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  страницу контактов
                </Link>
              </>
            )}
            . Мы ответим в установленный законом срок.
          </p>
        </Section>

        <Section title="8. Изменения политики">
          <p>
            Оператор вправе изменять настоящую Политику. Актуальная редакция всегда
            размещена на этой странице с указанием даты обновления.
          </p>
        </Section>

        <Section title="9. Контакты">
          <p>
            По вопросам обработки персональных данных:{" "}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                {email}
              </a>
            ) : (
              <Link
                href="/contacts"
                className="text-accent underline-offset-2 hover:underline"
              >
                см. страницу «Контакты»
              </Link>
            )}
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
