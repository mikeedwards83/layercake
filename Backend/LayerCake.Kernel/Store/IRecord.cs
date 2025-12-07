using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Store
{
    public interface IRecord
    {
        public Guid Id { get; set; }
        ValidationResult Validate();
    }
}
