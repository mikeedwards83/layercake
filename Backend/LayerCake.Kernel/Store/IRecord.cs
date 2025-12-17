using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Store
{
    public interface IRecord
    {
        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        
        public Guid UpdatedBy { get; set; }
        
        public  DateTime Created { get; set; }
        public DateTime Updated { get; set; }
    }
}
