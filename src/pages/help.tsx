import { useRouter } from "next/router";
import { TopBar } from "../components/TopBar";

export default function Tutorial() {
  return (
    <div className="flex w-full flex-col items-center justify-between">
      <div className="flex w-full flex-col gap-8">
        <TopBar />

        <div className="flex w-full flex-col gap-16 p-4">
          <div className="text-center text-2xl font-bold">
            Frequently asked questions
          </div>
          <div className="mx-auto flex max-w-lg flex-col gap-4 pb-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                How long do you store my photos?
              </h3>
              <p>
                Uploaded photos are only used to teach our AI how you look and
                are immediately erased after completion. The AI model is also
                deleted after the new photos have been generated. Only your
                generated photos will remain securely stored in our app. To
                erase them as well, simply delete your account. We never sell or
                share your data with third&#8209;parties.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                What kind of photos should I upload?
              </h3>
              <p>
                The quality of the generated images depends a lot on the quality
                of the images you upload. For the best results, upload at least
                20 photos as diverse as possible. Variety is key: different
                angles, poses, locations, and clothing.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Are there any restrictions I should know?
              </h3>
              <p>
                We do not allow children to use our app. Our technology has been
                developed and tested only for adults, and might have unexpected
                results if used by kids. We run an automatic age detection and
                block all users under 18. It is also forbidden to upload photos
                of someone else without their consent.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">How long does it take?</h3>
              <p>
                Your photos should be ready in about 2 hours, but it might take
                a bit more if our servers are under excessive load. In any case
                we will send you an email notification when it’s done.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">How much does it cost?</h3>
              <p>
                The cost of the service is around $9.99, varying a little
                depending on your region and currency.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                What payment methods do you accept?
              </h3>
              <p>
                We accept a variety of payment methods such as Visa, Mastercard,
                and American Express. Your payment information is securely
                stored by Stripe and all transactions are processed using
                industry-standard encryption, so you can rest assured that your
                information is protected.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                What if I don’t like the generated photos?
              </h3>
              <p>
                If you are not satisfied with the generated photos, you can
                request a refund within 14 days of your purchase by sending an
                email titled &ldquo;refund&rdquo; to team@pixelaibeta.com from
                the email address that you used when making the payment. We will
                issue a refund to your original payment method within 25
                business days.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Can I use my photos anywhere?
              </h3>
              <p>
                Absolutely! You are totally free to use your photos however you
                like. If you decide to post them online, you don&rsquo;t have to
                mention us or anything, but a little share to your best friends
                would be very helpful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
