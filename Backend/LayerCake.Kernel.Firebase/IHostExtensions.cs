using FirebaseAdmin;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Firebase
{
    public static class IHostExtensions
    {
        public static void UseFirebase(this IHost host)
        {
            //trigger creeation of the static app
            var firebaseApp = host.Services.GetRequiredService<FirebaseApp>();
        }
    }
}
